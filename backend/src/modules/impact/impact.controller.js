const db = require('../../config/db');

exports.getImpactStats = (req, res) => {

    try {

        const userId = req.user.id;

        const query = `
      SELECT
        COUNT(*) AS completed_orders,
        COALESCE(SUM(co2_saved), 0) AS total_co2_saved,
        COALESCE(SUM(money_saved), 0) AS total_money_saved
      FROM impact_logs
      WHERE user_id = ?
    `;

        db.query(query, [userId], (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: 'Database error'
                });

            }

            const stats = results[0];

            return res.status(200).json({
                message: 'Impact statistics fetched',
                data: {
                    completed_orders:
                        Number(stats.completed_orders),

                    co2_saved:
                        Number(stats.total_co2_saved),

                    money_saved:
                        Number(stats.total_money_saved)
                }
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: 'Server error'
        });

    }

};