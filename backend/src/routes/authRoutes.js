const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ email, passwordHash, name });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
// Login (retrocompatible)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const looksLikeBcrypt = (str) =>
      typeof str === "string" && /^\$2[aby]\$/.test(str);

    // intenta varios campos por compatibilidad
    const candidates = [
      user.passwordHash,
      user.password,
      user.hash,
      user.password_hash,
      user.pass,
    ].filter(Boolean);

    let isValid = false;
    let matchedField = null;
    let matchedValue = null;

    for (const val of candidates) {
      if (looksLikeBcrypt(val)) {
        const ok = await bcrypt.compare(password, val);
        if (ok) {
          isValid = true;
          matchedField = "bcrypt";
          matchedValue = val;
          break;
        }
      } else {
        // texto plano antiguo
        if (password === val) {
          isValid = true;
          matchedField = "plain";
          matchedValue = val;
          break;
        }
      }
    }

    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    // Migración: siempre dejarlo en passwordHash bcrypt
    if (!user.passwordHash || !looksLikeBcrypt(user.passwordHash)) {
      user.passwordHash = looksLikeBcrypt(matchedValue)
        ? matchedValue
        : await bcrypt.hash(password, 10);

      // limpiar campos antiguos si existen
      if (user.password !== undefined) user.password = undefined;
      if (user.hash !== undefined) user.hash = undefined;
      if (user.password_hash !== undefined) user.password_hash = undefined;
      if (user.pass !== undefined) user.pass = undefined;

      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;   // important
