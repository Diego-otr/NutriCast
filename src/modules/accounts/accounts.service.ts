import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
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

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const account: Account = this.accountRepository.create(createAccountDto);
    return await this.accountRepository.save(account);
  }

  async findOne(id: number): Promise<Account> {
    const account: Account | null = await this.accountRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async findByEmail(email: FindByEmailDto): Promise<Account> {
    const account: Account | null = await this.accountRepository.findOne({
      where: { email: email.email },
    });
    if (!account) {
      throw new NotFoundException(
        `Account with email ${email.email} not found`,
      );
    }
    return account;
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    Object.assign(account, updateAccountDto);
    return await this.accountRepository.save(account);
  }

  async remove(id: number): Promise<Account> {
    const account: Account = await this.findOne(id);
    await this.accountRepository.delete(id);
    return account;
  }
}
