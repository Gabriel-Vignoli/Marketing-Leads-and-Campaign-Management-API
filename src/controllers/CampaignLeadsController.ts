import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestschema,
  UpdateLeadRequestSchema,
} from "../schemas/CampaignsRequestSchema";
import { CampaignsRepository } from "../repositories/CampaignsRepository";
import { LeadsRepository, LeadWhereParams } from "../repositories/LeadsRepository";

export class CampaignLeadsController {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly leadsRepository: LeadsRepository
  ) {}
  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const query = GetCampaignLeadsRequestschema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      const limit = +pageSize
      const offset = (+page - 1) * limit;

      const where: LeadWhereParams = { campaignId, campaignStatus: status }

      if (name) where.name = { like: name, mode: "insensitive" };

      const leads = await this.leadsRepository.find({
        where,
        sortBy,
        order,
        limit,
        offset,
        include: { campaigns: true}
      })
      // const leads = await prisma.lead.findMany({
      //   where,
      //   orderBy: { [sortBy]: order },
      //   skip: (+page - 1) * +pageSize,
      //   take: +pageSize,
      //   include: {
      //     campaigns: true
      //   },
      // });
      
      const total = await this.leadsRepository.count(where)
      // const total = await prisma.lead.count({ where });

      res.json({
        leads,
        meta: {
          page: +page,
          pageSize: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      const { leadId, status = "New" } = AddLeadRequestSchema.parse(req.body);
      await this.campaignsRepository.addLead({ campaignId, leadId, status });
      // await prisma.leadCampaign.create({
      //   data: {
      //     campaignId: +req.params.campaignId,
      //     leadId: body.leadId,
      //     status: body.status,
      //   },
      // });
      res.status(201).end();
    } catch (error) {
      next(error);
    }
  };

  updateLeadStatus: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      const { status } = UpdateLeadRequestSchema.parse(req.body)
      await this.campaignsRepository.updateLeadStatus({ campaignId, leadId, status })
      // const updatedLeadCampaign = await prisma.leadCampaign.update({
      //   data: body,
      //   where: {
      //     // vai ver se ambas as colunas são iguais simultaneamente
      //     leadId_campaignId: {
      //       campaignId: +req.params.campaignId,
      //       leadId: +req.params.leadId,
      //     },
      //   },
      // });
      res.json({ message: "Lead status updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      await this.campaignsRepository.removeLead(campaignId, leadId)

      // const removedLead = await prisma.leadCampaign.delete({
      //   where: {
      //     leadId_campaignId: {
      //       campaignId: +req.params.campaignId,
      //       leadId: +req.params.leadId,
      //     },
      //   },
      // });
      res.json({ message: "Lead removed from campaign successfully" });
    } catch (error) {
      next(error);
    }
  };
}
