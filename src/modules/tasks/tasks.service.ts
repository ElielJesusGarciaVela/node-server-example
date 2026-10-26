import { prisma } from '../../config/db.js';
import type { Prisma } from '@prisma/client';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schema.js';

export async function createTask(data: CreateTaskInput) {
  const taskData: Prisma.TaskUncheckedCreateInput = {
    title: data.title,
    userId: data.userId,
  };
  if (data.description !== undefined) {
    taskData.description = data.description;
  }

  return prisma.task.create({ data: taskData });
}

export async function listTasks() {
  return prisma.task.findMany({ orderBy: { id: 'asc' } });
}

export async function findTaskById(id: number) {
  return prisma.task.findUnique({ where: { id } });
}

export async function updateTask(id: number, data: UpdateTaskInput) {
  const taskData: Prisma.TaskUpdateInput = {};
  if (data.title !== undefined) {
    taskData.title = data.title;
  }
  if (data.description !== undefined) {
    taskData.description = data.description;
  }
  if (data.done !== undefined) {
    taskData.done = data.done;
  }

  return prisma.task.update({ where: { id }, data: taskData });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({ where: { id } });
}
