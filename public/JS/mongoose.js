module.exports={
    mutipleMongooseToObject:function(mongooes){
        return mongooes.map(mongoose=>mongoose.toObject());
    },
    mongooseToObject:function(mongoose){
        return mongoose ? mongoose.toObject() : mongoose;
    }
}