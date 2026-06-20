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
exports.getDashboardAnalytics = (req, res) => {

    try {

        const analytics = {};

        // total users
        const usersQuery =
            `SELECT COUNT(*) AS total_users FROM users`;

        db.query(usersQuery, (err, userResult) => {

            if (err) {

                return res.status(500).json({
                    message: 'Users query failed'
                });

            }

            analytics.total_users =
                userResult[0].total_users;

            // total merchants
            const merchantQuery = `
        SELECT COUNT(*) AS total_merchants
        FROM merchant_profiles
      `;

            db.query(merchantQuery, (err, merchantResult) => {

                if (err) {

                    return res.status(500).json({
                        message: 'Merchant query failed'
                    });

                }

                analytics.total_merchants =
                    merchantResult[0].total_merchants;

                // total products
                const productQuery = `
          SELECT COUNT(*) AS total_products
          FROM surprise_bags
        `;

                db.query(productQuery, (err, productResult) => {

                    if (err) {

                        return res.status(500).json({
                            message: 'Product query failed'
                        });

                    }

                    analytics.total_products =
                        productResult[0].total_products;

                    // total orders
                    const orderQuery = `
            SELECT COUNT(*) AS total_orders
            FROM orders
          `;

                    db.query(orderQuery, (err, orderResult) => {

                        if (err) {

                            return res.status(500).json({
                                message: 'Order query failed'
                            });

                        }

                        analytics.total_orders =
                            orderResult[0].total_orders;

                        // total revenue
                        const revenueQuery = `
              SELECT
                COALESCE(SUM(total_amount), 0)
                AS total_revenue
              FROM orders
              WHERE status IN ('paid', 'picked_up')
            `;

                        db.query(revenueQuery, (err, revenueResult) => {

                            if (err) {

                                return res.status(500).json({
                                    message: 'Revenue query failed'
                                });

                            }

                            analytics.total_revenue =
                                Number(
                                    revenueResult[0]
                                        .total_revenue
                                );

                            // total co2 saved
                            const co2Query = `
                SELECT
                  COALESCE(SUM(co2_saved), 0)
                  AS total_co2_saved
                FROM impact_logs
              `;

                            db.query(co2Query, (err, co2Result) => {

                                if (err) {

                                    return res.status(500).json({
                                        message: 'CO2 query failed'
                                    });

                                }

                                analytics.total_co2_saved =
                                    Number(
                                        co2Result[0]
                                            .total_co2_saved
                                    );

                                return res.status(200).json({
                                    message:
                                        'Dashboard analytics fetched',

                                    data: analytics
                                });

                            });

                        });

                    });

                });

            });

        });

    } catch (error) {

        return res.status(500).json({
            message: 'Server error'
        });

    }

};