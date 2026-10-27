from django.contrib import admin
from .models import CarMake, CarModel

# Register your models here.

class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1

class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year', 'dealer_id')
    list_filter = ('type', 'year', 'car_make')
    search_fields = ('name', 'car_make__name')

class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]
    list_display = ('name', 'description')
    search_fields = ('name',)

# Registering models with their respective admin classes
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)