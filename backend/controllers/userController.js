const User = require("./../models/userModel");
const AppError = require("./../utils/appError");

const catchAsync = require("./../utils/catchAsync");
const factory = require("./../controllers/handlerFactory");

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id; //usuario logado
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteMe = factory.deleteOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /updateMyPassword"));
  }

  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});
