import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileItemHateoasInterceptor } from './interceptors/profiles-item-hateoas.interceptor';
import { ProfileCollectionHateoasInterceptor } from './interceptors/profiles-collection-hateoas.interceptor';
import { ProfileDeleteHateoasInterceptor } from './interceptors/profiles-delete-hateoas.interceptor';
import { Profile } from './entities/profile.entity';
import type { HateoasMessage } from '../../types/hateoas.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  getHateoasLinks(): HateoasMessage {
    return {
      message: 'Enlaces disponibles para perfiles',
      _links: {
        create: { href: '/profiles', method: 'POST' },
        findById: { href: '/profiles/{id}', method: 'GET' },
        findByAccount: { href: '/profiles/account/{accountId}', method: 'GET' },
        update: { href: '/profiles/{id}', method: 'PATCH' },
        delete: { href: '/profiles/{id}', method: 'DELETE' },
      },
    };
  }

  @Post()
  @UseInterceptors(ProfileItemHateoasInterceptor) // <--- Interceptor Individual
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return await this.profilesService.create(createProfileDto);
  }

  @Get('account/:accountId')
  @UseInterceptors(ProfileCollectionHateoasInterceptor) // <--- Interceptor de Colección
  async findAllByAccount(
    @Param('accountId') accountId: string,
  ): Promise<Profile[]> {
    return await this.profilesService.findAllByAccount(Number(accountId));
  }

  @Get(':id')
  @UseInterceptors(ProfileItemHateoasInterceptor) // <--- Interceptor Individual
  async findOne(@Param('id') id: string): Promise<Profile> {
    return await this.profilesService.findOne(Number(id));
  }

  @Patch(':id')
  @UseInterceptors(ProfileItemHateoasInterceptor) // <--- Interceptor Individual
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return await this.profilesService.update(Number(id), updateProfileDto);
  }

  @Delete(':id')
  @UseInterceptors(ProfileDeleteHateoasInterceptor) // <--- Interceptor de Eliminación
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.profilesService.remove(Number(id));
    return {
      message: `Perfil con ID ${id} eliminado correctamente`,
    };
  }
}
