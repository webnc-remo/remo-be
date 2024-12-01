import { Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'token' })
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  userId!: string;

  @Column({ type: 'varchar' })
  token!: string;

  @Column({ type: 'timestamp' })
  @Transform(({ value }: { value: Date }) => value.getTime() / 1000, {
    toPlainOnly: true,
  })
  iat!: Date;

  @Column({ type: 'timestamp' })
  @Transform(({ value }: { value: Date }) => value.getTime() / 1000, {
    toPlainOnly: true,
  })
  exp!: Date;
}
