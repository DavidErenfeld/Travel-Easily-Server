import Users from "../models/users_model";
import CreateController from "../controllers/base_controller";

const usersController = CreateController(Users);

export default usersController;
