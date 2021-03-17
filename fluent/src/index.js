import data from './../database/data.json';
import FluentSQLBuilder from './fluentSQL.js';

const result = FluentSQLBuilder.for(data)
.select(['name', 'category', 'phone', 'registered'])
.where({registered : /^2020|2019/})
.where({category: /^(security|developer)$/})
.where({phone: /\((906|862|951)\)/})
.orderBy('name')
.limit(2)
.build();

console.table(result);