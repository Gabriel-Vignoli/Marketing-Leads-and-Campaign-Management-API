import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import {
  CreateCampaignRequestSchema,
  UpdateCampaignRequestSchema,
} from "../schemas/CampaignsRequestSchema";
import { CampaignsRepository } from "../repositories/CampaignsRepository";

export class CampaignsController {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  index: Handler = async (req, res, next) => {
    try {
      const campaigns = await this.campaignsRepository.find();
      // const campaigns = await prisma.campaign.findMany();
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  };

  create: Handler = async (req, res, next) => {
    try {
      const body = CreateCampaignRequestSchema.parse(req.body);
      const newCampaign = await this.campaignsRepository.create(body)
      // const newCampaign = await prisma.campaign.create({
      //   data: body,
      // });
      res.status(201).json(newCampaign);
    } catch (error) {
      next(error);
    }
  };

  show: Handler = async (req, res, next) => {
    try {
      const id = +req.params.id
      const campaign = await this.campaignsRepository.findById(id);
      // const campaign = await prisma.campaign.findUnique({
      //   where: { id: +req.params.id },
      //   include: { leads: {
      //       include: { lead: true }
      //   } },

      if (!campaign) throw new HttpError(404, "Campaign not found");

      res.json(campaign);
    } catch (error) {
      next(error);
    }
  };

  update: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const body = UpdateCampaignRequestSchema.parse(req.body);

      const updatedCampaign = await this.campaignsRepository.updateById(id, body)
      // const updatedCampaign = await prisma.campaign.update({
      //   data: body,
      //   where: { id },
      // });
      
      if (!updatedCampaign) throw new HttpError(404, "Campaign not found");


      res.json(updatedCampaign);
    } catch (error) {
      next(error);
    }
  };

  delete: Handler = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const deletedCampaign = await this.campaignsRepository.deleteById(id)
      // const deletedCampaign = await prisma.campaign.delete({
      //   where: { id: +req.params.id },
      // });
      
      if (!deletedCampaign) throw new HttpError(404, "Campaign not found");

      res.json({ deletedCampaign });
    } catch (error) {
      next(error);
    }
  };
}
