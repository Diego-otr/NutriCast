import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const profile: Profile = this.profileRepository.create(createProfileDto);
    return await this.profileRepository.save(profile);
  }

  async findAllByAccount(accountId: number) {
    return await this.profileRepository.find({ where: { accountId } });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile: Profile | null = await this.profileRepository.findOne({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
    const updatedProfile = this.profileRepository.merge(
      profile,
      updateProfileDto,
    );
    return await this.profileRepository.save(updatedProfile);
  }

  async remove(id: number) {
    return await this.profileRepository.delete(id);
  }
}
