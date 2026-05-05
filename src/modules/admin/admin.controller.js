const db = require('../../config/db');

exports.getAllMerchants = (req, res) => {

    try {

        const query = `
      SELECT
        merchant_profiles.*,
        users.email
      FROM merchant_profiles
      JOIN users
      ON merchant_profiles.user_id = users.id
      ORDER BY merchant_profiles.created_at DESC
    `;

        db.query(query, (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: 'Database error'
                });

            }

            return res.status(200).json({
                message: 'Merchants fetched',
                total: results.length,
                data: results
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: 'Server error'
        });

    }

};

exports.verifyMerchant = (req, res) => {

    try {

        const { id } = req.params;

        const query = `
      UPDATE merchant_profiles
      SET is_verified = true
      WHERE id = ?
    `;

        db.query(query, [id], (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: 'Verification failed'
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: 'Merchant not found'
                });

            }

            return res.status(200).json({
                message: 'Merchant verified successfully'
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: 'Server error'
        });

    }

};