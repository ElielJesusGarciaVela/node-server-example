import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { createTask, listTasks, findTaskById, updateTask, deleteTask } from './tasks.service.js';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schema.js';

function parseTaskId(value: string | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Error interno';
}

export async function createTaskCtrl(
  req: Request<Record<string, never>, unknown, CreateTaskInput>,
  res: Response,
) {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error: unknown) {
    if (isPrismaError(error, 'P2003')) {
      return res.status(400).json({ message: 'El usuario indicado no existe' });
    }
    res.status(500).json({ message: errorMessage(error) });
  }
}

export async function listTasksCtrl(_req: Request, res: Response) {
  try {
    const tasks = await listTasks();
    res.json(tasks);
  } catch (error: unknown) {
    res.status(500).json({ message: errorMessage(error) });
  }
}

export async function getTaskCtrl(req: Request, res: Response) {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const task = await findTaskById(id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error: unknown) {
    res.status(500).json({ message: errorMessage(error) });
  }
}

export async function updateTaskCtrl(
  req: Request<{ id: string }, unknown, UpdateTaskInput>,
  res: Response,
) {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const task = await updateTask(id, req.body);
    res.json(task);
  } catch (error: unknown) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(500).json({ message: errorMessage(error) });
  }
}

export async function deleteTaskCtrl(req: Request, res: Response) {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    await deleteTask(id);
    res.status(204).send();
  } catch (error: unknown) {
    if (isPrismaError(error, 'P2025')) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(500).json({ message: errorMessage(error) });
  }
}
