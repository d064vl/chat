import { Exclude, Expose, Transform } from "class-transformer";
import * as moment from 'moment';

export class userDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    // @Exclude()
    @Expose()
    password: string;

    @Expose()
    @Transform(({ value }) => value ? moment(value).format('DD/MM/YYYY') : null, { toClassOnly: true })
    date: string;
}