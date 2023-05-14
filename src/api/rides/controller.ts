import database from '../../loaders/database';
import Logger from '../../loaders/logger';
import crypto from 'crypto';
const riderData = [
  {
    id: crypto.randomBytes(16).toString('hex'),
    name: 'rider 1',
    previous_drivers: [],
    rating: 1,
  },
  {
    id: crypto.randomBytes(16).toString('hex'),
    name: 'rider 2',
    previous_drivers: [],
    rating: 2,
  },
  {
    id: crypto.randomBytes(16).toString('hex'),
    name: 'rider 3',
    previous_drivers: [],
    rating: 3,
  },
  {
    id: crypto.randomBytes(16).toString('hex'),
    name: 'rider 4',
    previous_drivers: [],
    rating: 4,
  },
  {
    id: crypto.randomBytes(16).toString('hex'),
    name: 'rider 5',
    previous_drivers: [],
    rating: 5,
  },
];

export async function findRide(id: string) {
  try {
    const db = await database();
    const collection = db.collection('riders');
    // finding the rider
    const rider_data = await collection.findOne({ id });

    if (!rider_data) {
      throw { code: 404, error: 'Rider not found' };
    }

    // finding the available drivers
    const driver_collection = db.collection('drivers');
    const available_drivers = await driver_collection
      .find({
        ride_status: 'available',
        rating: { $gte: rider_data.rating },
      })
      .toArray();

    if (!available_drivers) {
      throw { code: 200, error: 'No Driver found at this moment' };
    }

    // finding the driver who has not driven the rider before
    const driver = available_drivers.filter((item) => {
      return !item.previous_rides.includes(id);
    })[0];

    if (!driver) {
      throw { code: 200, error: 'No Driver found at this moment' };
    }

    const cab_collection = db.collection('cab');
    // finding the cab of the driver
    const cab = await cab_collection.findOne({ driver_name: driver.name });

    if (!cab) {
      throw { code: 404, error: 'Cab not found' };
    }

    return {
      status: 200,
      response: {
        success: true,
        rider_data,
        driver_data: driver,
        cab_data: cab,
      },
    };
  } catch (err: any) {
    Logger.error(err.error);
    return {
      status: err.code || 409,
      response: { success: false, message: err.error || 'ISR' },
    };
  }
}

export async function insertion() {
  try {
    const db = await database();
    const collection = db.collection('riders');

    const result = await collection.insertMany(riderData);
    return {
      status: 200,
      response: {
        success: true,
      },
    };
  } catch (err: any) {
    Logger.error(err.error);
    return {
      status: err.code || 409,
      response: { success: false, message: err.error || 'ISR' },
    };
  }
}
