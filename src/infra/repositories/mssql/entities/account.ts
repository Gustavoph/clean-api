import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'account', synchronize: false })
export class AccountModel {
  @PrimaryColumn({ type: 'varchar' })
    id: string

  @Column({ type: 'varchar' })
    name: string

  @Column({ type: 'varchar' })
    password: string

  @Column({ type: 'varchar' })
    sigeCode: string

  @Column({ type: 'varchar' })
    permission: string

  @Column({ type: 'varchar' })
    createdAt: string
}
