-- Task 1 #5.1
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Task 1 #5.2
UPDATE account
SET account_type = 'Admin'
WHERE account_lastname = 'Stark';

-- Task 1 #5.3
DELETE from account
WHERE account_lastname = 'Stark';

-- Task 1 #5.4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- Task 1 #5.5
SELECT inv_make, inv_model, classification_name FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- Task 1 #5.6
UPDATE inventory 
SET inv_image = REPLACE (inv_image,'images/','images/vehicles/'),
	inv_thumbnail = REPLACE (inv_thumbnail,'images/','images/vehicles/');
