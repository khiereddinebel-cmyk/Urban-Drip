from api.admin import admin_site
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

from django.shortcuts import redirect

def root_view(request):
    """Redirect root to the custom admin panel."""
    return redirect('/admin/')

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin_site.urls),
    path('api/', include('api.urls')),
]

    # Serve static and media files in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
