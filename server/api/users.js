const router = require('express').Router()
const {User} = require('../db/models')
const { isLoggedIn } = require('../auth/gatekeepers') 
module.exports = router

router.get('/', isLoggedIn, (req, res, next) => {
	User.findAll({
	// explicitly select only id, emailm and name fields - even though
	// users' passwords are encrypted, it won't help if we just
	// send everything to anyone who asks!
		attributes: ['id', 'email', 'name']
	})
		.then(users => res.json(users))
		.catch(next)
})

router.put('/:userId', isLoggedIn, (req, res, next) => {
	User.findById(req.params.userId)
		.then(user => user.update(req.body))
		.then(updatedUser => res.json(updatedUser))
		.catch(next)
})
