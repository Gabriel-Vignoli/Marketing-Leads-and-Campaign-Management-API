import { Handler } from "express";
import { GetLeadsRequestSchema } from "../schemas/LeadsRequestSchema";
import { addLeadRequestSchema } from "../schemas/GroupsRequestSchema";
import { GroupLeadsService } from "../services/GroupLeadsService";

export class GroupLeadsController {
  constructor(
    private readonly groupLeadsService: GroupLeadsService
  ) {}

  getLeads: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const query = GetLeadsRequestSchema.parse(req.query);

      const leads = await this.groupLeadsService.getLeadsData({
        ...query,
        groupId,
        page: query.page ? +query.page : undefined,
        pageSize: query.pageSize ? +query.pageSize : undefined,
      });
      
      res.json(leads);
    } catch (error) {
      next(error);
    }
  };

  addLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const { leadId } = addLeadRequestSchema.parse(req.body);

      const updatedGroup = await this.groupLeadsService.addLeadToGroup(groupId, leadId);
      res.status(201).json(updatedGroup);
    } catch (error) {
      next(error);
    }
  };

  removeLead: Handler = async (req, res, next) => {
    try {
      const groupId = +req.params.groupId;
      const leadId = +req.params.leadId;

      const removedLead = await this.groupLeadsService.removeLeadFromGroup(
        groupId,
        leadId
      );
      res.status(200).json(removedLead);
    } catch (error) {
      next(error);
    }
  };
}
