const async = require('async');
const debug = require('debug')('reportsemester');
const { body, validationResult } = require('express-validator');

const Report = require('../models/report_semester')

exports.set_header = (req, res, next) =>{
		Report.countDocuments().exec((err, results) => {
		res.set('Content-Range', results);
		next();
		})
	}


exports.show_all = (req, res, next) => {
	debug(Object.keys(req.query).length)
	if(Object.keys(req.query).length === 0){
		debug("No query")
		Report.find({}).exec(
		(err, results) =>{
			if(err){return next(err);}
			// debug(results);
			res.json(results);
		}
		)	

	}else{
		const filter = JSON.parse(req.query.filter)
		const range = JSON.parse(req.query.range)
		const sort = JSON.parse(req.query.sort)
		const [start, end] = range;
		const [resource, order] = sort;
		const orderLowerCase = order.toLowerCase()
		
		debug(req.query);
		debug(start, end)
		
		Report.find({}).sort({[resource]: [orderLowerCase]}).skip(start).limit(end-start+1).exec(
			(err, results) =>{
				res.json(results)
			})
	}
}

exports.show_one = (req, res, next) => {
	Report.findById(req.params.id).exec(
		(err, results) =>{
			if(err){return next(err);}
			debug(results);
			res.json(results);
		}
		)
}

exports.create = [
	body('author').trim().isLength({min:1}),
	body('month').isLength({min:1}),

	(req, res, next) => {
		const error = validationResult(req)
		debug(error)
		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			
				const report = new Report({
					author: req.body.author,
					month: req.body.month,
					report: {
						question1: {
							total: req.body.report.question1.total,
							detail: req.body.report.question1.detail,
						},
						question2: {
							total: req.body.report.question2.total,
							detail: req.body.report.question2.detail,
						},
						question3: {
							total: req.body.report.question3.total,
							detail: req.body.report.question3.detail,
						},
						question4: {
							total: req.body.report.question4.total,
							detail: req.body.report.question4.detail,
						},
						question5: {
							total: req.body.report.question5.total,
							detail: req.body.report.question5.detail,
						},
						question6: {
							total: req.body.report.question6.total,
							detail: req.body.report.question6.detail,
						},
						question7: {
							total: req.body.report.question7.total,
							detail: req.body.report.question7.detail,
						},
						question8: {
							total: req.body.report.question8.total,
							detail: req.body.report.question8.detail,
						},
					}
				})
				// debug(report)
				Report.create(report, (err, results) =>{
					if(err){return next(err);}
					debug(results)
					res.send("Successfully created per Semester Report");
				})
		}
	}
]

exports.update = [
	body('author').trim().isLength({min:1}),
	body('month').isLength({min:1}),

	(req, res, next) => {
		const error = validationResult(req)
		debug(error)
		if(!error.isEmpty()){
			throw new Error("Error : ");
		}else{
			
				const report = new Report({
					_id: req.params.id,
					author: req.body.author,
					month: req.body.month,
					report: {
						question1: {
							total: req.body.report.question1.total,
							detail: req.body.report.question1.detail,
						},
						question2: {
							total: req.body.report.question2.total,
							detail: req.body.report.question2.detail,
						},
						question3: {
							total: req.body.report.question3.total,
							detail: req.body.report.question3.detail,
						},
						question4: {
							total: req.body.report.question4.total,
							detail: req.body.report.question4.detail,
						},
						question5: {
							total: req.body.report.question5.total,
							detail: req.body.report.question5.detail,
						},
						question6: {
							total: req.body.report.question6.total,
							detail: req.body.report.question6.detail,
						},
						question7: {
							total: req.body.report.question7.total,
							detail: req.body.report.question7.detail,
						},
						question8: {
							total: req.body.report.question8.total,
							detail: req.body.report.question8.detail,
						},
					}
				})
				// debug(report)
				Report.findByIdAndUpdate(req.params.id, report, (err, results) =>{
					if(err){return (next(err));}
					debug(results)
					res.send("Successfully updated per Semester Report");
				})
		}
	}	
]

exports.delete = (req, res, next) => {
	Report.findByIdAndRemove(req.params.id).exec((err,results) =>{
		if(err){return next(err);}
		res.send("Sucessfully deleted per Semester Report");
	})
}




