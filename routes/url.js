const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const Url = require('../models/Url');
const { BASE_URL } = process.env;

// POST /shorten
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!validUrl.isUri(longUrl)) return res.status(400).json({ error: 'Invalid URL' });

  let url = await Url.findOne({ longUrl });
  if (url) return res.json({ shortUrl: `${BASE_URL}/${url.code}` });

  const code = nanoid(6);
  url = new Url({ code, longUrl });
  await url.save();
  res.status(201).json({ shortUrl: `${BASE_URL}/${code}` });
});

// GET /:code
router.get('/:code', async (req, res) => {
  const url = await Url.findOne({ code: req.params.code });
  if (!url) return res.status(404).json({ error: 'Not found' });

  url.clicks++;
  await url.save();
  res.redirect(url.longUrl);
});

// GET /stats/:code
router.get('/stats/:code', async (req, res) => {
  const url = await Url.findOne({ code: req.params.code });
  if (!url) return res.status(404).json({ error: 'Not found' });

  res.json({
    longUrl: url.longUrl,
    createdAt: url.createdAt,
    clicks: url.clicks,
  });
});

module.exports = router;
