import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    try {
        console.log('Starting seeding process...');

        // 1. Ensure we have a "System" user to own these listings
        let systemUser = await prisma.user.findUnique({
            where: { email: 'admin@rtu.ac.in' }
        });

        if (!systemUser) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            systemUser = await prisma.user.create({
                data: {
                    email: 'admin@rtu.ac.in',
                    name: 'CampusMart Admin',
                    password: hashedPassword,
                    year: '4th Year',
                    mobile: '9876543210'
                }
            });
            console.log('Created admin user.');
        }

        const seedItems = [
            {
                title: 'Engineering Lab Coat (Size M)',
                description: 'Premium quality white lab coat. Specifically used for chemistry and mechanical labs. Used for only one semester, cleaned and ironed.',
                price: 450,
                category: 'Academic',
                condition: 'Gently Used',
                image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Casio Scientific Calculator FX-991EX',
                description: 'Essential for engineering students. Support for matrix, vector, and complex calculations. Battery replaced recently.',
                price: 850,
                category: 'Electronics',
                condition: 'Excellent',
                image: 'https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Sturdy Wooden Study Table',
                description: 'Compact wooden table perfect for hostel rooms. Includes a small drawer for stationeries. Very stable.',
                price: 1200,
                category: 'Dorm Essentials',
                condition: 'Good',
                image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Mountain Cycle (21 Gears)',
                description: 'Hero Sprint mountain bike. Perfect for commuting across the large campus. Front suspension and disk brakes work perfectly.',
                price: 4800,
                category: 'Transport',
                condition: 'Gently Used',
                image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Noise Cancelling Wireless Headphones',
                description: 'BoAt Rockerz 450. Great for studying in the library. 15 hours playback time. Bass boosted.',
                price: 999,
                category: 'Electronics',
                condition: 'Gently Used',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Single Bed Mattress (3x6)',
                description: 'Cotton filled soft mattress. Fits all standard hostel beds. Very clean and kept in protective cover.',
                price: 1500,
                category: 'Dorm Essentials',
                condition: 'Gently Used',
                image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800'
            }
        ];

        console.log('Adding 6 seed listings...');
        for (const item of seedItems) {
            await prisma.item.create({
                data: {
                    ...item,
                    sellerId: systemUser.id,
                    status: 'AVAILABLE'
                }
            });
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
