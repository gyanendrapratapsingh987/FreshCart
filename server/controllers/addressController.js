import Address from "../models/Address.js";

// Add Address
export const addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    console.log("Add Address Body:", req.body);

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!address) {
      return res.json({
        success: false,
        message: "Address details are required",
      });
    }

    const newAddress = await Address.create({
      userId,
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      phone: address.phone,
    });

    return res.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.log("Add Address Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Address
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required",
      });
    }

    const addresses = await Address.find({ userId }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log("Get Address Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};