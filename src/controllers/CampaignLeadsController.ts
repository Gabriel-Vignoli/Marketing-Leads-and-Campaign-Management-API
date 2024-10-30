import { Handler } from "express";
import {
  AddLeadRequestSchema,
  GetCampaignLeadsRequestschema,
  UpdateLeadRequestSchema,
} from "../schemas/CampaignsRequestSchema";
import { CampaignLeadsService } from "../services/CampaignLeadsService";

export class CampaignLeadsController {
  constructor(
    private readonly campaignLeadsService: CampaignLeadsService
  ) {}

  getLeads: Handler = async (req, res, next) => {
    try {
      const campaignId = +req.params.campaignId;
      const query = GetCampaignLeadsRequestschema.parse(req.query);
      const leads = await this.campaignLeadsService.getLeadsData({
        ...query,
        campaignId,
        page: query.page ? +query.page : undefined,
        pageSize: query.pageSize ? +query.pageSize : undefined,
      });
      res.json(leads)
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId);
      const { leadId, status = "New" } = AddLeadRequestSchema.parse(req.body);
      await this.campaignLeadsService.addLeadToCampaign({campaignId, leadId, status});
    
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
      await this.campaignLeadsService.updatedLeadStatusToCampaign({ campaignId, leadId, status })
    
      res.json({ message: "Lead status updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const campaignId = Number(req.params.campaignId)
      const leadId = Number(req.params.leadId)
      await this.campaignLeadsService.removeLeadFromCampaign(campaignId, leadId)

      res.json({ message: "Lead removed from campaign successfully" });
    } catch (error) {
      next(error);
    }
  };
}
