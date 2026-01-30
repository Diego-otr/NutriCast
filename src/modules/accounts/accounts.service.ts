import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
@Injectable()
export class AccountsService {
  create(createAccountDto: CreateAccountDto) {
    return 'This action adds a new account';
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
