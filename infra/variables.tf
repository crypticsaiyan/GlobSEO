variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  default = "dev"
}

variable "db_instance_class" {
  default = "db.t3.micro"
}

variable "db_username" {
  sensitive = true
}

variable "db_password" {
  sensitive = true
}

variable "subnet_ids" {
  type = list(string)
  default = []
}

variable "public_subnet_ids" {
  type = list(string)
  default = []
}