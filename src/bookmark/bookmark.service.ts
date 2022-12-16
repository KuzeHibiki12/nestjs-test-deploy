import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookMark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookMark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookMark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookMark = await this.prisma.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    // check if user owns the bookmark
    if (!bookMark || bookMark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookMark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // get the bookmark by id
    const bookMark = await this.prisma.bookMark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    // check if user owns the bookmark
    if (!bookMark || bookMark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    await this.prisma.bookMark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
