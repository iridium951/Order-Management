const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    UserName: {
        type: String
    },
    FirstName: {
        type: String
    },
    LastName: {
        type: String
    },
    Age: {
        type: String // String to demo validator.isInt
    },
    EmailAddress: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Password: {
        type: String,
        required: true,
        minlength: 6
    },
    token:
        [{ type: String }]
});

userSchema.pre("save", function (next) {
    //console.log('pre: ' + JSON.stringify(this));
    //console.log('pre: ' + this.isNew);
    if (this.isModified("Password") || this.isNew) {
        //console.log('pre: 1');
        //console.log('Password: ' + this.Password);
        bcrypt.genSalt(saltRounds, (genSaltError, saltt) => {
            if (genSaltError) {
                //console.log('pre: 2 ' + genSaltError);
                return next(genSaltError);
            }
            //console.log('saltt: ' + saltt);
            bcrypt.hash(this.Password, saltt, (hashError, hash) => {
                if (hashError) {
                    return next(hashError);
                }
                this.Password = hash;
                //console.log('hash: ' + hash);
                next();
            })
        }
        )
    }

});

userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.Password, function (error, isMatch) {
        if (error) {
            console.log('compare: ' + error);
            return callback(error);
        }
        console.log('compare: ' + isMatch);
        callback(null, isMatch);
    })
}

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;