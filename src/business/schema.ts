import { EClassError, throwCustomError } from "@utils";
import Joi from "joi";
import R from "ramda";
import { v4 as uuidv4 } from "uuid";
import {
  CreateTodoInput,
  EPriority,
  ETodoStatus,
  Todo,
} from "../models";
import { toISOString } from "./moment";

const todoSchema = Joi.object<Todo>({
  taskOrder: Joi.number().integer().min(0),
  taskDescription: Joi.string().required(),
  taskOwner: Joi.string().required(),
  taskPriority: Joi.string().valid(...Object.values(EPriority)),
  taskStatus: Joi.string().valid(...Object.values(ETodoStatus)),
  id: Joi.string().required(),
  createdAt: Joi.string().isoDate(),
  updatedAt: Joi.string().isoDate(),
});

/**
 * @description Validate a Todo event on creation
 * @function
 * @param {CreateTodoInput} [data] input data for create task
 * @param {string} [owner] owner of the task
 * @returns {Todo}
 */
export const validateSchema = (
  validation: Joi.ValidationResult,
  methodPath: string
): void => {
  if (validation.error) {
    return throwCustomError(
      validation.error,
      methodPath,
      EClassError.USER_ERROR
    );
  }
};
