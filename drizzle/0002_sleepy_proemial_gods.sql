CREATE SEQUENCE cash_back_rules_id_seq AS integer START 1 OWNED BY cash_back_rules.id;

ALTER TABLE cash_back_rules ALTER COLUMN id SET DEFAULT nextval('cash_back_rules_id_seq');
