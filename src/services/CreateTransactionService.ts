import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestDTO): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionRepository);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('This transaction is not permitted.');
    }

    const existsCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let newCategory = existsCategory && existsCategory;

    if (!newCategory) {
      newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: newCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
