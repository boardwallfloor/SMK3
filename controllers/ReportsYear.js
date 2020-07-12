const async = require('async');
const debug = require('debug')('reportyear');
const { body, validationResult } = require('express-validator');

const Report = require('../models/report_year')

const handleFilter = (filter) => {
		const filterJson = JSON.parse(filter)
		return filterJson;
	}

const handleRange = (range) => {
	const rangeJson = JSON.parse(range)
	const [start, end] = rangeJson;
	const limitation = end-start+1;
	return [start,limitation];
}

const handleSort = (sort) => {
	const sortJson = JSON.parse(sort)
	const [resource, order] = sortJson;
	const orderLowerCase = order.toLowerCase()
	return sortOn={
		[resource]: [orderLowerCase]
	}
}

exports.set_header = (req, res, next) =>{
		Report.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}


exports.show_all = async (req, res, next) => {

	debug(Object.keys(req.query).length)

	if(Object.keys(req.query).length === 0){
		debug("No query")
		Report.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			res.json(results);
		}
		)	

	}else{
		debug("Query :");
		debug(req.query)
		let filter;
		let start, limitation;
		let sort;

		if(req.query.range != undefined){
			const range  = await handleRange(req.query.range);
			[start, limitation] = range;
		}

		if(req.query.filter != undefined){
			filter = await handleFilter(req.query.filter);
		}

		if(req.query.sort != undefined) {
			sort = handleSort(req.query.sort);
		}
		
		Report.find(filter).sort(sort).skip(start).limit(limitation).exec(
			(err, results) =>{
				res.json(results)
			})
	}
}

exports.show_one = (req, res, next) => {
	Report.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results.year_formatted);
			res.json(results);
		}
		)
}

exports.show_ten = async (req, res, next) => {
	let filter={};
	debug(req.query)

	if(req.query.filter != undefined){
		filter = await handleFilter(req.query.filter);
	}			
	async.parallel({
		data: (callback) => {
			Report.find(filter).populate('author').populate('institution').sort('year +1').limit(10).exec(callback)
		},
		count: (callback) => {
			Report.countDocuments(filter).exec(callback)
		}
	},(err, results) => {
		if(err){return next(err);}
		debug(results)
		res.json(results);
	})
}

exports.create = [
	body('author').trim().escape().isLength({min:1}),
	body('total').trim().isLength({min:1}).isNumeric(),
	body('Institution'),
	body('year').toDate().optional({ checkFalsy: true }).isISO8601(),

	(req, res, next) => {
		// debug(req.body)
		debug(req.body)
		const error = validationResult(req)
		if(!error.isEmpty()){
			debug(error)
			throw new Error();
		}else{
			
				const report = new Report({
					author: req.body.author,
					total: req.body.total,
					year: req.body.year,
					institution: req.body.institution,
					report: {
						question1: {
							a: {information: req.body.report.question1.a.information},
							b: {information: req.body.report.question1.b.information},
							c: {information: req.body.report.question1.c.information},
						},
						question2: {
							a: {information: req.body.report.question2.a.information},
							b: {information: req.body.report.question2.b.information},
							c: {information: req.body.report.question2.c.information},
						},
						question3: {
							a: {information: req.body.report.question3.a.information},
							b: {information: req.body.report.question3.b.information},
							c: {information: req.body.report.question3.c.information},
							d: {information: req.body.report.question3.d.information},
						},
						question4: {
							a: {information: req.body.report.question4.a.information},
							b: {information: req.body.report.question4.b.information},
							c: {information: req.body.report.question4.c.information},
						},
						question5: {
							a: {information: req.body.report.question5.a.information},
							b: {information: req.body.report.question5.b.information},
							c: {information: req.body.report.question5.c.information},
						},
						question6: {
							a: {information: req.body.report.question6.a.information},
							b: {information: req.body.report.question6.b.information},
						},
						question7: {
							a: {information: req.body.report.question7.a.information},
							b: {information: req.body.report.question7.b.information},
							c: {information: req.body.report.question7.c.information},
						},
						question8: {
							a: {information: req.body.report.question8.a.information},
							b: {information: req.body.report.question8.b.information},
							c: {information: req.body.report.question8.c.information},
						},
						question9: {
							information: req.body.report.question9.information,
						},
						question10: {
							a: {information: req.body.report.question10.a.information},
							b: {
									a: {information: req.body.report.question10.b.a.information},
									b: {information: req.body.report.question10.b.b.information},
									c: {information: req.body.report.question10.b.c.information},
							},
							c: {
									a: {information: req.body.report.question10.c.a.information},
									b: {information: req.body.report.question10.c.b.information},
							}
						},
						question11: {
							a: {information: req.body.report.question11.a.information},
							b: {information: req.body.report.question11.b.information},
						},
					}
				})
				debug(report)
				Report.create(report, (err, results) =>{
					if(err){return next(err);}
					// debug(results)
					// res.send("Successfully created per Year Report");
					res.send(results);
				})
		}
	}
]

exports.update = [
	body('author'),
	body('total', "total").trim().isLength({min:1}).isNumeric(),
	body('area',"area").trim().isLength({min:1}).isNumeric(),
	body('year',"year").toDate().optional({ checkFalsy: true }).isISO8601(),

	(req, res, next) => {
		// debug(req.body)
		debug(req.body.year)
		const error = validationResult(req)
		if(!error.isEmpty()){
			debug(error.errors)
			throw new Error();
		}else{
			
				const report = new Report({
					_id: req.params.id,
					author: req.body.author,
					area: req.body.area,
					total: req.body.total,
					year: req.body.year,
					report: {
						question1: {
							a: {information: req.body.report.question1.a.information},
							b: {information: req.body.report.question1.b.information},
							c: {information: req.body.report.question1.c.information},
						},
						question2: {
							a: {information: req.body.report.question2.a.information},
							b: {information: req.body.report.question2.b.information},
							c: {information: req.body.report.question2.c.information},
						},
						question3: {
							a: {information: req.body.report.question3.a.information},
							b: {information: req.body.report.question3.b.information},
							c: {information: req.body.report.question3.c.information},
							d: {information: req.body.report.question3.d.information},
						},
						question4: {
							a: {information: req.body.report.question4.a.information},
							b: {information: req.body.report.question4.b.information},
							c: {information: req.body.report.question4.c.information},
						},
						question5: {
							a: {information: req.body.report.question5.a.information},
							b: {information: req.body.report.question5.b.information},
							c: {information: req.body.report.question5.c.information},
						},
						question6: {
							a: {information: req.body.report.question6.a.information},
							b: {information: req.body.report.question6.b.information},
						},
						question7: {
							a: {information: req.body.report.question7.a.information},
							b: {information: req.body.report.question7.b.information},
							c: {information: req.body.report.question7.c.information},
						},
						question8: {
							a: {information: req.body.report.question8.a.information},
							b: {information: req.body.report.question8.b.information},
							c: {information: req.body.report.question8.c.information},
						},
						question9: {
							information: req.body.report.question9.information,
						},
						question10: {
							a: {information: req.body.report.question10.a.information},
							b: {
									a: {information: req.body.report.question10.b.a.information},
									b: {information: req.body.report.question10.b.b.information},
									c: {information: req.body.report.question10.b.c.information},
							},
							c: {
									a: {information: req.body.report.question10.c.a.information},
									b: {information: req.body.report.question10.c.b.information},
							}
						},
						question11: {
							a: {information: req.body.report.question11.a.information},
							b: {information: req.body.report.question11.b.information},
						},
					}
				})
				debug(report)
				Report.findByIdAndUpdate(req.params.id, report, (err, results) =>{
					if(err){return (next(err));}
					debug(results)
					// res.send("Successfully updated per Year Report");
					res.send(results);
				})
		}
	}
]

exports.delete = (req, res, next) => {
	Report.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		// res.send("Sucessfully deleted per Year Report");
		res.json(results);
	})
}