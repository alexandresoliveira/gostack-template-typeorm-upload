import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const repository = getRepository(Transaction);
    const existsTransaction = await repository.findOne(id);
    if (!existsTransaction) {
      throw new AppError('Transaction not found!');
    }
    await repository.remove(existsTransaction);
  }
}

export default DeleteTransactionService;
