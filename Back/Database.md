# Structure for database

## Acticles

	:::json
	[
		{
			name: ""(title slug),
			slug: ""(title slug),
			file: ""(file path),			
			title:  {
				view: "",
				slug: ""
			}
			tag: [
					{
						view: "",
						slug: ""
					},
					...
			],
			author: [
					{
						view: "",and
						slug: ""
					},
					...
			],
			category: {
				view: "",
				slug: ""
			},
			date: "YYYY.mm.DD,HH:MM:SS",
			summary:  "",
			content: "",
			...
		},
		...
	]


## Archives

	:::json
	[
		{
			name: ""(title slug),
			slug: ""(title slug),
			title:  {
				view: "",
				slug: ""
			}
			tag: [
					{
						view: "",
						slug: ""
					},
					...
			],
			author: [
					{
						view: "",and
						slug: ""
					},
					...
			],
			category: {
				view: "",
				slug: ""
			},
			date: "YYYY.mm.DD,HH:MM:SS",
			summary:  ""
			...
		},
		...
	]


## Category

	:::json
	[
		{ 
			name: ""(category slug),
			slug: ""(title slug),
			title:  {
				view: "",
				slug: ""
			}
			tag: [
					{
						view: "",
						slug: ""
					},
					...
			],
			author: [
					{
						view: "",and
						slug: ""
					},
					...
			],
			category: {
				view: "",
				slug: ""
			},
			date: "YYYY.mm.DD,HH:MM:SS",
			summary:  ""
			...
		},
		...
	]

## Tag

	:::json
	[
		{ 
			name: ""(tag slug),
			slug: ""(title slug),
			title:  {
				view: "",
				slug: ""
			}
			tag: [
					{
						view: "",
						slug: ""
					},
					...
			],
			author: [
					{
						view: "",and
						slug: ""
					},
					...
			],
			category: {
				view: "",
				slug: ""
			},
			date: "YYYY.mm.DD,HH:MM:SS",
			summary:  ""
			...
		},
		...
	]

## Author

	:::json
	[
		{ 
			name: ""(author slug),
			slug: ""(title slug),
			title:  {
				view: "",
				slug: ""
			}
			tag: [
					{
						view: "",
						slug: ""
					},
					...
			],
			author: [
					{
						view: "",and
						slug: ""
					},
					...
			],
			category: {
				view: "",
				slug: ""
			},
			date: "YYYY.mm.DD,HH:MM:SS",
			summary:  ""
			...
		},
		...
	]

## Tags

	:::json
	[
		{
			view: "",
			slug: "",
			count: 0
		},
		...
	]

## Authors

	:::json
	[
		{
			view: "",
			slug: "",
			count: 0
		},
		...
	]