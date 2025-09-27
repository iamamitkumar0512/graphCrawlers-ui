import { Entity, Type } from '@graphprotocol/hypergraph';

export class Image extends Entity.Class<Image>('Image')({
  url: Type.String
}) {}

export class Project extends Entity.Class<Project>('Project')({
  name: Type.String,
  description: Type.String,
  xUrl: Type.String,
  avatar: Type.Relation(Image)
}) {}

export class Dapp extends Entity.Class<Dapp>('Dapp')({
  name: Type.String,
  description: Type.String,
  xUrl: Type.String,
  githubUrl: Type.String,
  avatar: Type.Relation(Image)
}) {}

export class Investor extends Entity.Class<Investor>('Investor')({
  name: Type.String
}) {}

export class FundingStage extends Entity.Class<FundingStage>('FundingStage')({
  name: Type.String
}) {}

export class InvestmentRound extends Entity.Class<InvestmentRound>('InvestmentRound')({
  name: Type.String,
  raisedAmount: Type.Number,
  investors: Type.Relation(Investor),
  fundingStages: Type.Relation(FundingStage),
  raisedBy: Type.Relation(Project)
}) {}

export class Asset extends Entity.Class<Asset>('Asset')({
  name: Type.String,
  symbol: Type.String,
  blockchainAddress: Type.String
}) {}

export class PostMetrics extends Entity.Class<PostMetrics>('PostMetrics')({
  claps: Type.Number,
  views: Type.Number,
  comments: Type.Number,
  shares: Type.Number
}) {}

export class Author extends Entity.Class<Author>('Author')({
  name: Type.String,
  username: Type.String,
  profileUrl: Type.String
}) {}

export class PostData extends Entity.Class<PostData>('PostData')({
  postId: Type.String,
  title: Type.String,
  content: Type.String,
  excerpt: Type.String,
  author: Type.Relation(Author),
  url: Type.String,
  publishedAt: Type.String,
  tags: Type.String,
  metrics: Type.Relation(PostMetrics),
  featuredImage: Type.String,
  readingTime: Type.Number
}) {}

export class Paragraph extends Entity.Class<Paragraph>('Paragraph')({
  companyName: Type.String,
  platform: Type.String,
  postData: Type.Relation(PostData)
}) {}

export class AcademicField extends Entity.Class<AcademicField>('AcademicField')({
  description: Type.String,
  name: Type.String
}) {}