/**
 * @author Joshua A. Levine [josh@email.arizona.edu]
 * @course CSC 444
 * @file test-cases.js
 * @date 3/31/2021
 * @summary Dataset for CSC444 Assignment 09
 *
 * These are two very simply trees, the first (test_1) being a single node with three children and
 * the second (test_2) being a tree with two branches, the first with 3 children and the second
 * with 2.
 *
 */
var test_1 = {
	'name':     'root',
	'children': [
		{'name': 'child1', 'size': 10},
		{'name': 'child2', 'size': 20},
		{'name': 'child3', 'size': 30}
	]
};

var test_2 = {
	'name':     'root',
	'children': [
		{'name':     'branch1',
			'children': [
				{'name': 'child1', 'size': 10},
				{'name': 'child2', 'size': 20},
				{'name': 'child3', 'size': 30}
			]
		},
		{'name':     'branch2',
			'children': [
				{'name': 'child1', 'size': 25},
				{'name': 'child2', 'size': 25}
			]
		}
	]
};

var test_3 = {
	'name':     'root',
	'children': [
		{'name': 'child1', 'size': 60},
		{'name': 'child2', 'size': 60},
		{'name': 'child3', 'size': 40},
		{'name': 'child4', 'size': 30},
		{'name': 'child5', 'size': 20},
		{'name': 'child6', 'size': 20},
		{'name': 'child7', 'size': 10}
	]
};

var test_4 = {
	'name':     'root',
	'children': [
		{
			'name':     'branch1',
			'children': [
				{'name': 'child1', 'size': 10},
				{'name': 'child2', 'size': 20},
				{'name': 'child3', 'size': 30}
			]
		},
		{
			'name':     'branch2',
			'children': [
				{
					'name':     'branch3',
					'children': [
						{'name': 'child1', 'size': 10},
						{'name': 'child2', 'size': 10}
					]
				},
				{
					'name': 'child2', 'size': 25
				}
			]
		}
		
	]
};

