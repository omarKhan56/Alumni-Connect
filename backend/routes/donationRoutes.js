const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { Donation } = require('../models');

// Make a donation
router.post('/', protect, async (req, res) => {
try {
const donation = await Donation.create({
donor: req.user._id,
amount: req.body.amount,
cause: req.body.cause,
message: req.body.message,
status: 'success'
});

```
res.status(201).json(donation);
```

} catch (err) {
res.status(500).json({ message: err.message });
}
});

// User donation history
router.get('/history', protect, async (req, res) => {
try {
const donations = await Donation.find({ donor: req.user._id })
.sort({ createdAt: -1 });

```
res.json(donations);
```

} catch (err) {
res.status(500).json({ message: err.message });
}
});

// All successful donations (admin)
router.get('/all', protect, async (req, res) => {
try {
const donations = await Donation.find({ status: 'success' })
.populate('donor', 'name profilePic')
.sort({ createdAt: -1 });

```
res.json(donations);
```

} catch (err) {
res.status(500).json({ message: err.message });
}
});

module.exports = router;
