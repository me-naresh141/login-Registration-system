let mongoose = require('mongoose')
let bcrypt = require('bcrypt')
let Schema = mongoose.Schema

let userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minimum: 5 },
  },
  { timestamps: true },
)

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      // console.log(hashed)
      this.password = hashed
      return next()
    })
  } else {
    return next()
  }
})


// 
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result)
  })
}

module.exports = mongoose.model('Userdata', userSchema)
