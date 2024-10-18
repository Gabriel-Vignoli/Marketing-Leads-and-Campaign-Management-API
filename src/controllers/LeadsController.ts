import { Handler } from "express";
import { prisma } from "../database";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "../schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "@prisma/client";

export class LeadsController {
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
      const { page = "1", pageSize = "10", name, status, sortBy = "name", order = "asc" } = query

      const where: Prisma.LeadWhereInput = {}

      if (name) where.name = { contains: name, mode: "insensitive" }
      if (status) where.status = status

      const leads = await prisma.lead.findMany({
        where,
        // Ex: se o page for 2 e o page size for 10, vai tirar 1 do page e multiplicar por 10. Então pulando 10 resultados, e aparecendo a partir do 11
        skip: (+page - 1) * +pageSize,
        orderBy: { [ sortBy ]: order}
      });

      const total = await prisma.lead.count({ where })

      res.json({
        data: leads,
        pagination: {
            page: +page,
            pageSize: +pageSize,
            total,
            totalPages: Math.ceil(total / +pageSize)
            }
      });
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);

      const newLead = await prisma.lead.create({
        data: body,
      });

      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id: +req.params.id },
        include: {
          groups: true,
          campaigns: true,
        },
      });

      if (!lead) throw new HttpError(404, "Lead not found");

      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const body = UpdateLeadRequestSchema.parse(req.body);

      const leadExists = await prisma.lead.findUnique({ where: { id: +req.params.id } })
      if (!leadExists) throw new HttpError(404, "lead não encontrado")

      const updatedLead = await prisma.lead.update({
        data: body,
        where: { id: +req.params.id },
      });


      res.json(updatedLead);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
     try {
        const leadExists = await prisma.lead.findUnique({ where: { id: +req.params.id } })
        if (!leadExists) throw new HttpError(404, "lead não encontrado")

        const deletedLead = await prisma.lead.delete({
            where: { id: +req.params.id}
        })

        res.json(deletedLead);
     } catch (error) {
        next(error)
     }
  }
}
