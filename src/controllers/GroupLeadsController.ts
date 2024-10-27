import { Handler } from "express";
import { GetLeadsRequestSchema } from "../schemas/LeadsRequestSchema";
import { addLeadRequestSchema } from "../schemas/GroupsRequestSchema";
import { GroupsRepository } from "../repositories/GroupsRepository";
import {
  LeadsRepository,
  LeadWhereParams,
} from "../repositories/LeadsRepository";

export class GroupLeadsController {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}
  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const query = GetLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      const limit = +pageSize;
      const offset = (+page - 1) * limit;

      const where: LeadWhereParams = { groupId };

      if (name) where.name = { like: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        order,
        limit,
        offset,
        include: { groups: true}
      });
      // const leads = await prisma.lead.findMany({
      //   where,
      //   orderBy: { [sortBy]: order },
      //   skip: (+page - 1) * +pageSize,
      //   take: +pageSize,
      //   include: {
      //     groups: true,
      //   },
      // });

      const total = await this.leadsRepository.count(where);
      // const total = await prisma.lead.count({ where });

      res.json({
        leads,
        meta: {
          page: +page,
          pageSize: +pageSize,
          total: total,
          totalPages: Math.ceil(total / +pageSize),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const { leadId } = addLeadRequestSchema.parse(req.body);

      const updatedGroup = await this.groupsRepository.addLead(groupId, leadId);
      // const updatedGroup = await prisma.group.update({
      //   where: { id: +req.params.groupId },
      //   data: {
      //     leads: {
      //       connect: { id: body.leadId },
      //     },
      //   },
      //   include: { leads: true },
      // });
      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.params.leadId;

      const removedLead = await this.groupsRepository.removeLead(
        groupId,
        leadId
      );
      // const removedLead = await prisma.group.update({
      //   where: { id: +req.params.groupId },
      //   data: {
      //      leads: {
      //       disconnect: { id: +req.params.leadId}
      //      }
      //   },
      //   include: { leads: true }
      // });
      res.status(200).json(removedLead);
    } catch (error) {
      next(error);
    }
  };
}
