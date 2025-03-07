import mongoose from 'mongoose';
import Customer from '../models/Customer';

const { ObjectId } = mongoose.Types;

class CustomerController {
  async index(req, res) {
    const clinic = req.clinicId;
    const customers = await Customer.find({ clinic }).sort({ createdAt: -1 });

    return res.status(200).json({ customers });
  }

  async store(req, res) {
    const {
      cpf,
      name,
      zipcode,
      street,
      number,
      neighborhood,
      phoneNumber,
      cellNumber,
      email,
    } = req.body;

    const clinic = req.clinicId;

    if (await Customer.findOne({ cpf, clinic })) {
      return res
        .status(400)
        .json({ error: 'Customer already exists for this clinic.' });
    }

    const customer = await Customer.create({
      cpf,
      name,
      zipcode,
      street,
      number,
      neighborhood,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : '',
      cellNumber: cellNumber !== undefined ? cellNumber : '',
      email,
      clinic,
    });

    return res.status(201).json(customer);
  }

  async change(req, res) {
    const {
      cpf,
      name,
      zipcode,
      street,
      number,
      neighborhood,
      phoneNumber,
      cellNumber,
      email,
    } = req.body;

    const clinic = req.clinicId;

    const customer = await Customer.findOneAndUpdate(
      { cpf, clinic },
      {
        cpf,
        name,
        zipcode,
        street,
        number,
        neighborhood,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : '',
        cellNumber: cellNumber !== undefined ? cellNumber : '',
        email,
        clinic,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(400).json({ error: 'Customer not found.' });
    }

    return res.status(200).json(customer);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Customer.deleteOne({ _id: new ObjectId(id) });

    return res.status(200).json({ success: 'Deletado com sucesso' });
  }
}

export default new CustomerController();
