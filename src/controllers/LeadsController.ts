import { Handler } from "express";
import { prisma } from "../database";
import {
  CreateLeadRequestSchema,
  UpdateLeadRequestSchema,
} from "../schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class LeadsController {
  index: Handler = async (req, res, next) => {
    try {
      const leads = await prisma.lead.findMany();
      res.json(leads);
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