import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "../schemas/CampaignsRequestSchema";
import { CampaignsService } from "../services/CampaignsService";

export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsService.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const newCampaign = await this.campaignsService.createCampaigns(body);
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const campaign = await this.campaignsService.getcampaignById(id);
      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = UpdateCampaignRequestSchema.parse(req.body);
      const updatedCampaign = await this.campaignsService.updateCampaignById(
        id,
        body
      );
      res.json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const deletedCampaign = await this.campaignsService.deleteCampaignById(id);
      res.json({ deletedCampaign });
    } catch (error) {
      next(error);
    }
  };
}
