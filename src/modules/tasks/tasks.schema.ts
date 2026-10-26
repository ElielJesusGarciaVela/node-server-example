import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().max(500, 'La descripción no puede superar 500 caracteres').optional(),
  userId: z.number().int().positive('El usuario indicado no es válido'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede superar 500 caracteres')
    .nullable()
    .optional(),
  done: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
