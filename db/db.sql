create database test
default character set utf8 
collate utf8_general_ci;

use test;

select * from eat;
select * from food;

ALTER TABLE food MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

ALTER TABLE eat MODIFY COLUMN eat_id BIGINT NOT NULL AUTO_INCREMENT;



insert into food (food_name, carbohydrates, protein, fat, calories, sugar)
values ('명란마요 샐러드',21, 4, 7, 165, 2 );





