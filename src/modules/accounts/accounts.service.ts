import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { FindByEmailDto } from './dto/find-by-email.dto';
@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const account: Account = this.accountRepository.create(createAccountDto);
    return await this.accountRepository.save(account);
  }

  async findOne(id: number) {
    return await this.accountRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });
  }

  async findByEmail(email: FindByEmailDto) {
    return await this.accountRepository.findOne({
      where: { email: email.email },
    });
  }

  async remove(id: number) {
    return await this.accountRepository.delete(id);
  }
}
