import dotenv from 'dotenv';
import Court from '../models/Court.js';
import Equipment from '../models/Equipment.js';
import Coach from '../models/Coach.js';
import PricingRule from '../models/PricingRule.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        await Court.deleteMany({});
        await Equipment.deleteMany({});
        await Coach.deleteMany({});
        await PricingRule.deleteMany({});

        console.log('Cleared existing data...');

        const courts = await Court.insertMany([
            {
                name: 'Indoor Court 1',
                type: 'indoor',
                basePrice: 500,
                description: 'Premium indoor court with air conditioning'
            },
            {
                name: 'Indoor Court 2',
                type: 'indoor',
                basePrice: 500,
                description: 'Premium indoor court with wooden flooring'
            },
            {
                name: 'Outdoor Court 1',
                type: 'outdoor',
                basePrice: 300,
                description: 'Standard outdoor court'
            },
            {
                name: 'Outdoor Court 2',
                type: 'outdoor',
                basePrice: 300,
                description: 'Standard outdoor court with lighting'
            }
        ]);
        console.log('Courts seeded');

        const equipment = await Equipment.insertMany([
            {
                name: 'Yonex Racket',
                type: 'racket',
                totalQuantity: 10,
                pricePerUnit: 50,
                description: 'Professional grade badminton racket'
            },
            {
                name: 'Li-Ning Racket',
                type: 'racket',
                totalQuantity: 8,
                pricePerUnit: 40,
                description: 'Intermediate level racket'
            },
            {
                name: 'Sports Shoes (Size 8)',
                type: 'shoes',
                totalQuantity: 5,
                pricePerUnit: 30,
                description: 'Non-marking badminton shoes'
            },
            {
                name: 'Sports Shoes (Size 9)',
                type: 'shoes',
                totalQuantity: 5,
                pricePerUnit: 30,
                description: 'Non-marking badminton shoes'
            },
            {
                name: 'Sports Shoes (Size 10)',
                type: 'shoes',
                totalQuantity: 5,
                pricePerUnit: 30,
                description: 'Non-marking badminton shoes'
            }
        ]);
        console.log('Equipment seeded');

        const coaches = await Coach.insertMany([
            {
                name: 'Rajesh Kumar',
                email: 'rajesh.kumar@badminton.com',
                phone: '+91-9876543210',
                specialization: 'Singles & Doubles Strategy',
                pricePerHour: 500,
                availability: [
                    { dayOfWeek: 1, startTime: '06:00', endTime: '10:00' },
                    { dayOfWeek: 1, startTime: '17:00', endTime: '21:00' },
                    { dayOfWeek: 3, startTime: '06:00', endTime: '10:00' },
                    { dayOfWeek: 3, startTime: '17:00', endTime: '21:00' },
                    { dayOfWeek: 5, startTime: '06:00', endTime: '10:00' },
                    { dayOfWeek: 5, startTime: '17:00', endTime: '21:00' }
                ],
                bio: '10 years of professional coaching experience. Former state champion.'
            },
            {
                name: 'Priya Sharma',
                email: 'priya.sharma@badminton.com',
                phone: '+91-9876543211',
                specialization: 'Beginners & Technique',
                pricePerHour: 400,
                availability: [
                    { dayOfWeek: 2, startTime: '07:00', endTime: '12:00' },
                    { dayOfWeek: 2, startTime: '16:00', endTime: '20:00' },
                    { dayOfWeek: 4, startTime: '07:00', endTime: '12:00' },
                    { dayOfWeek: 4, startTime: '16:00', endTime: '20:00' },
                    { dayOfWeek: 6, startTime: '08:00', endTime: '14:00' }
                ],
                bio: 'Specialized in teaching beginners and improving basic techniques.'
            },
            {
                name: 'Amit Patel',
                email: 'amit.patel@badminton.com',
                phone: '+91-9876543212',
                specialization: 'Advanced Training & Fitness',
                pricePerHour: 600,
                availability: [
                    { dayOfWeek: 0, startTime: '06:00', endTime: '12:00' },
                    { dayOfWeek: 1, startTime: '06:00', endTime: '09:00' },
                    { dayOfWeek: 3, startTime: '06:00', endTime: '09:00' },
                    { dayOfWeek: 5, startTime: '06:00', endTime: '09:00' },
                    { dayOfWeek: 6, startTime: '06:00', endTime: '12:00' }
                ],
                bio: 'National level player with expertise in fitness and advanced techniques.'
            }
        ]);
        console.log('Coaches seeded');

        const pricingRules = await PricingRule.insertMany([
            {
                name: 'Peak Hour Premium',
                description: 'Higher rates during peak hours (6 PM - 9 PM)',
                priority: 1,
                conditions: {
                    timeRange: {
                        startTime: '18:00',
                        endTime: '21:00'
                    }
                },
                modifier: {
                    type: 'percentage',
                    value: 30,
                    operation: 'multiply'
                }
            },
            {
                name: 'Weekend Surcharge',
                description: 'Additional charges for weekend bookings',
                priority: 2,
                conditions: {
                    daysOfWeek: [0, 6]
                },
                modifier: {
                    type: 'percentage',
                    value: 20,
                    operation: 'multiply'
                }
            },
            {
                name: 'Indoor Court Premium',
                description: 'Premium pricing for indoor courts',
                priority: 3,
                conditions: {
                    courtTypes: ['indoor']
                },
                modifier: {
                    type: 'fixed',
                    value: 200,
                    operation: 'add'
                }
            },
            {
                name: 'Early Morning Discount',
                description: 'Discount for bookings before 8 AM',
                priority: 4,
                conditions: {
                    timeRange: {
                        startTime: '06:00',
                        endTime: '08:00'
                    }
                },
                modifier: {
                    type: 'percentage',
                    value: -10,
                    operation: 'multiply'
                }
            }
        ]);
        console.log('Pricing rules seeded');

        console.log('Database seeded successfully!');
        console.log(`Summary:`);
        console.log(`Courts: ${courts.length}`);
        console.log(`Equipment: ${equipment.length}`);
        console.log(`Coaches: ${coaches.length}`);
        console.log(`Pricing Rules: ${pricingRules.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();