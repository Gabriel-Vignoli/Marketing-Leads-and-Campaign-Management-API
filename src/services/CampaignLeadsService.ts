import { LeadCampaignStatus } from "@prisma/client";
import { LeadsRepository, LeadWhereParams } from "../repositories/LeadsRepository";
import { AddLeadToCampaignAttributes, CampaignsRepository } from "../repositories/CampaignsRepository";
import { HttpError } from "../errors/HttpError";

interface GetLeadsParams {
    campaignId: number;
    page?: number;
    pageSize?: number;
    name?: string;
    status?: LeadCampaignStatus;
    sortBy?: "name" | "status" | "createdAt";
    order?: "asc" | "desc";
  }

export class CampaignLeadsService {
    constructor(private readonly campaignsRepository: CampaignsRepository,
        private readonly leadsRepository: LeadsRepository
    ) {}

    async getLeadsData(params: GetLeadsParams) {
        const { campaignId, page = 1, pageSize= 10, name, status, sortBy, order } = params;

        const offset = (page - 1) * pageSize;

        const where: LeadWhereParams = { campaignId };
    
        if (name) where.name = { like: name, mode: "insensitive" };
    
        const leads = await this.leadsRepository.find({
          where,
          sortBy,
          order,
          limit: pageSize,
          offset,
          include: { campaigns: true },
        });
    
        const total = await this.leadsRepository.count(where);
    
        return {
          data: leads,
          pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
          },
        };    
    }

    async addLeadToCampaign(params: AddLeadToCampaignAttributes) {
        const campaign = await this.campaignsRepository.findById(params.campaignId);
        if (!campaign) throw new HttpError(404, "Campaign not found");
    
        const lead = await this.leadsRepository.findById(params.leadId);
        if (!lead) throw new HttpError(404, "Lead not found");
    
        return this.campaignsRepository.addLead(params);
      }

      async updatedLeadStatusToCampaign(params: AddLeadToCampaignAttributes) {
        const campaign = await this.campaignsRepository.findById(params.campaignId);
        if (!campaign) throw new HttpError(404, "Campaign not found");
    
        const lead = await this.leadsRepository.findById(params.leadId);
        if (!lead) throw new HttpError(404, "Lead not found");
    
        return this.campaignsRepository.updateLeadStatus(params);
      }
    
      async removeLeadFromCampaign(campaignId: number, leadId: number) {
        const campaign = await this.campaignsRepository.findById(campaignId);
        if (!campaign) throw new HttpError(404, "Campaign not found");
    
        const lead = await this.leadsRepository.findById(leadId);
        if (!lead) throw new HttpError(404, "Lead not found");
    
        return this.campaignsRepository.removeLead(campaignId, leadId);
      }
}